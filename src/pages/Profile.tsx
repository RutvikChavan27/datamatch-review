import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const Profile = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [digitalSignaturePassword, setDigitalSignaturePassword] = useState('');
  const [applyTimestamp, setApplyTimestamp] = useState(false);

  const isPasswordFormValid = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile</h2>
          <p className="text-muted-foreground">
            Manage your password settings and digital signature preferences
          </p>
        </div>

        {/* Password Settings Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Password Settings</h2>
            <Card className="transition-all duration-200 border border-border/40 rounded-2xl shadow-md border-border/50 bg-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Reset Password</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password<span className="text-red-500">*</span></Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter Password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password<span className="text-red-500">*</span></Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm Password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="mt-4"
                    disabled={!isPasswordFormValid}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Digital Signature Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Digital Signature</h2>
            <Card className="transition-all duration-200 border border-border/40 rounded-2xl shadow-md border-border/50 bg-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Signature and Initials Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center space-y-2 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Add Signature</span>
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center space-y-2 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Add Initials</span>
                    </div>
                  </div>

                  {/* Digital Signature Password */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-signature-password">Digital Signature Password</Label>
                    <Input
                      id="digital-signature-password"
                      type="password"
                      placeholder="Enter Password..."
                      value={digitalSignaturePassword}
                      onChange={(e) => setDigitalSignaturePassword(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  {/* Timestamp Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="apply-timestamp"
                      checked={applyTimestamp}
                      onCheckedChange={(checked) => setApplyTimestamp(!!checked)}
                    />
                    <Label
                      htmlFor="apply-timestamp"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Apply Timestamp to Your Signatures
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;