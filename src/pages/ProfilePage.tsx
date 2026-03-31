import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { CameraIcon } from 'lucide-react';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { useAuthMeQuery, useUpdateProfileMutation } from '../services/auth/hooks';
import { useCreateBankAccountMutation, useUpdateBankAccountMutation } from '../services/bankAccounts/hooks';
import { useNigerianBanksQuery } from '../services/banks/hooks';
import { useToast } from '../contexts/ToastContext';
import { changePasswordSchema, UpdateProfileFormData, ChangePasswordFormData } from '../schemas/marketplace';
import { z } from 'zod';

export function ProfilePage() {
  console.log('🔥 ProfilePage component mounted!');
  
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') ?? 'personal');
  const { data: me, isLoading: isMeLoading, error: meError } = useAuthMeQuery();
  const { data: banks, isLoading: isBanksLoading, error: banksError } = useNigerianBanksQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const toast = useToast();

  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormData & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Initialize profile form with user data
  useEffect(() => {
    if (me?.user) {
      setProfileForm({
        firstName: me.user.firstName || '',
        lastName: me.user.lastName || '',
        email: me.user.email || '',
        phone: me.user.phone || '',
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [me?.user]);

  const createBankAccountMutation = useCreateBankAccountMutation();
  const updateBankAccountMutation = useUpdateBankAccountMutation();

  const bankAccounts = useMemo(() => me?.user?.bankAccounts ?? [], [me]);
  const defaultBankAccount = useMemo(
    () => bankAccounts.find((acc) => acc.isDefault) ?? bankAccounts[0] ?? null,
    [bankAccounts]
  );

  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');
  const selectedBankAccount = useMemo(() => {
    if (!selectedBankAccountId) return null;
    return bankAccounts.find((acc) => acc.id === selectedBankAccountId) ?? null;
  }, [bankAccounts, selectedBankAccountId]);

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    if (!bankAccounts.length) {
      setSelectedBankAccountId('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      return;
    }

    const nextSelected = selectedBankAccountId || defaultBankAccount?.id || '';
    if (nextSelected !== selectedBankAccountId) {
      setSelectedBankAccountId(nextSelected);
    }
  }, [bankAccounts.length, defaultBankAccount?.id, selectedBankAccountId]);

  useEffect(() => {
    const source = selectedBankAccount ?? defaultBankAccount;
    if (!source) return;
    setBankName(source.bankName ?? '');
    setAccountNumber(source.accountNumber ?? '');
    setAccountName(source.accountName ?? '');
  }, [defaultBankAccount, selectedBankAccount]);

  const handleSaveBankDetails = async () => {
    const payload = {
      bankName,
      accountName,
      accountNumber
    };

    console.log('[Profile][Bank] Save bank details payload:', {
      selectedBankAccountId,
      bankAccountsCount: bankAccounts.length,
      payload,
    });

    try {
      if (!bankAccounts.length) {
        console.log('[Profile][Bank] Creating bank account payload:', {
          ...payload,
          isDefault: true,
        });
        await createBankAccountMutation.mutateAsync({
          bankName: payload.bankName,
          accountName: payload.accountName,
          accountNumber: payload.accountNumber,
          isDefault: true
        });
        toast.success('Bank details added successfully!');
        return;
      }

      if (!selectedBankAccountId) return;
      console.log('[Profile][Bank] Updating bank account payload:', {
        bankAccountId: selectedBankAccountId,
        payload: {
          ...payload,
          isDefault: true,
        },
      });
      await updateBankAccountMutation.mutateAsync({
        bankAccountId: selectedBankAccountId,
        payload: {
          ...payload,
          isDefault: true
        }
      });
      toast.success('Bank details updated successfully!');
    } catch {
      toast.error('Failed to save bank details.');
    }
  };

  // Profile update handlers
  const handleProfileChange = (field: keyof UpdateProfileFormData, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: keyof (ChangePasswordFormData & { confirmPassword: string }), value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});

    console.log('=== PROFILE SUBMIT DEBUG ===');
    console.log('Form data being submitted:', profileForm);
    console.log('User data:', me?.user);
    console.log('=== END PROFILE SUBMIT DEBUG ===');

    try {
      // Create a payload with only the fields that are being updated
      const payload: any = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone || undefined,
      };

      // Only include password fields if they are provided
      if (profileForm.currentPassword && profileForm.newPassword) {
        payload.currentPassword = profileForm.currentPassword;
        payload.newPassword = profileForm.newPassword;
      }

      console.log('Payload being sent:', payload);

      await updateProfileMutation.mutateAsync(payload);
      toast.success('Profile updated successfully!');
      
      // Clear password fields after successful update
      setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error('=== PROFILE SUBMIT ERROR ===');
      console.error('Error details:', error);
      
      if (error instanceof z.ZodError) {
        console.log('Zod error issues:', error.issues);
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as string;
            errors[fieldName] = err.message;
          }
        });
        setProfileErrors(errors);
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    alert('🔥 Password form submitted! Check console for details.');

    console.log('=== PASSWORD SUBMIT DEBUG ===');
    console.log('Password form data:', passwordForm);
    console.log('Current profile form:', profileForm);
    console.log('User data:', me?.user);
    console.log('=== END PASSWORD SUBMIT DEBUG ===');

    try {
      // Check if passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        console.log('❌ Passwords do not match');
        setPasswordErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }

      console.log('✅ Passwords match, validating...');
      const validatedData = changePasswordSchema.parse(passwordForm);
      console.log('✅ Validation passed:', validatedData);
      
      console.log('🚀 Calling updateProfileMutation...');
      
      // Only send password fields, not profile fields
      const payload = {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword
      };
      console.log('📤 Payload being sent:', payload);
      
      const result = await updateProfileMutation.mutateAsync(payload);
      console.log('✅ API call successful:', result);
      
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error('=== PASSWORD SUBMIT ERROR ===');
      console.error('❌ Error details:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'No message');
      
      if (error instanceof z.ZodError) {
        console.log('❌ Zod error issues:', error.issues);
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as string;
            errors[fieldName] = err.message;
          }
        });
        setPasswordErrors(errors);
      } else {
        console.log('❌ Non-Zod error, showing toast');
        toast.error('Failed to change password. Please try again.');
      }
    }
  };
  // Show loading state while user data is being fetched
  if (isMeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ink-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-8 max-w-5xl mx-auto pb-12">
      
      <h1 className="text-3xl font-bold text-ink tracking-tight">
        Profile Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-72 shrink-0 space-y-2">
          {[
          {
            id: 'personal',
            label: 'Personal Information'
          },
          {
            id: 'bank',
            label: 'Bank Details'
          },
          {
            id: 'security',
            label: 'Security Settings'
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-ink text-white shadow-md' : 'text-ink-secondary hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'}`}>
            
              {tab.label}
            </button>
          )}
        </div>

        <Card className="flex-1 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          {activeTab === 'personal' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <div className="flex items-center gap-8 pb-8 border-b border-gray-100">
                <div className="relative">
                  <Avatar
                    initials={`${me?.user?.firstName?.[0] || ''}${me?.user?.lastName?.[0] || ''}`}
                    size="lg"
                    className="w-24 h-24 text-3xl shadow-sm border-4 border-white" />
                  
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-ink hover:text-ajo-600 transition-colors">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-ink text-2xl mb-1">
                    {me?.user?.firstName} {me?.user?.lastName}
                  </h3>
                  <p className="text-base text-ink-secondary">
                    {me?.user?.email}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <Input
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    error={profileErrors.firstName}
                    className="h-12 rounded-xl" />
                  
                  <Input
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    error={profileErrors.lastName}
                    className="h-12 rounded-xl" />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    error={profileErrors.email}
                    className="h-12 rounded-xl" />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    error={profileErrors.phone}
                    className="h-12 rounded-xl" />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="rounded-xl h-12 px-8 relative"
                    disabled={updateProfileMutation.isPending}
                    onClick={() => console.log('Button clicked!')}
                  >
                    {updateProfileMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <span className={updateProfileMutation.isPending ? 'opacity-0' : ''}>
                      {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </span>
                  </Button>
                </div>
              </form>
            </motion.div>
          }

          {activeTab === 'bank' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted pb-4 border-b border-gray-100">
                Withdrawal Account
              </h3>

              {meError ? (
                <div className="text-sm text-red-600 font-medium">Failed to load bank details.</div>
              ) : null}
              {banksError ? (
                <div className="text-sm text-red-600 font-medium">Failed to load banks list.</div>
              ) : null}

              <div className="space-y-6 max-w-md">
                {bankAccounts.length > 1 ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink">
                      Saved Accounts
                    </label>
                    <select
                      disabled={isMeLoading}
                      value={selectedBankAccountId}
                      onChange={(e) => setSelectedBankAccountId(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-ink focus:outline-none focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 transition-all appearance-none shadow-sm"
                    >
                      {bankAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.bankName} • {acc.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">
                    Bank Name
                  </label>
                  <SearchableSelect
                    value={bankName}
                    onChange={setBankName}
                    placeholder="Select bank"
                    disabled={isMeLoading || isBanksLoading}
                    options={banks ?? []}
                    className="h-12"
                  />
                </div>

                <Input
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-12 rounded-xl shadow-sm" />
              

                <Input
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="h-12 rounded-xl shadow-sm" />
              
              </div>

              <div className="pt-6">
                <Button
                  className="rounded-xl h-12 px-8"
                  isLoading={createBankAccountMutation.isPending || updateBankAccountMutation.isPending}
                  onClick={handleSaveBankDetails}
                  disabled={isMeLoading || !bankName || !accountName || !accountNumber}
                >
                  Update Bank Details
                </Button>
              </div>
            </motion.div>
          }

          {activeTab === 'security' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="space-y-8">
            
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted pb-4 border-b border-gray-100">
                Change Password
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  error={passwordErrors.currentPassword}
                  className="h-12 rounded-xl shadow-sm" />
                
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  error={passwordErrors.newPassword}
                  className="h-12 rounded-xl shadow-sm" />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  error={passwordErrors.confirmPassword}
                  placeholder="Confirm new password"
                  className="h-12 rounded-xl shadow-sm" />
                
                <div className="pt-4 pb-8 border-b border-gray-100">
                  <Button 
                    type="submit"
                    className="rounded-xl h-12 px-8 relative"
                    disabled={updateProfileMutation.isPending}
                    onClick={() => {
                      console.log('🔥 PASSWORD BUTTON CLICKED!');
                      console.log('🔥 Form data:', passwordForm);
                      console.log('🔥 Password errors:', passwordErrors);
                    }}
                  >
                    {updateProfileMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <span className={updateProfileMutation.isPending ? 'opacity-0' : ''}>
                      {updateProfileMutation.isPending ? 'Updating...' : 'Update Password'}
                    </span>
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-between pt-4 bg-surface p-6 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="font-bold text-ink text-lg mb-1">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm font-medium text-ink-secondary">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-ajo-600 focus:ring-offset-2">
                  <span className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition-transform shadow-sm" />
                </button>
              </div>
            </motion.div>
          }
        </Card>
      </div>
    </motion.div>);

}