import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Shield, 
  Smartphone, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Monitor,
  Trash2
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // Load user sessions
      const sessionsResult = await AuthService.getUserSessions();
      if (sessionsResult.success && sessionsResult.sessions) {
        setSessions(sessionsResult.sessions);
      }

      // Load audit logs (would need to implement this in AuthService)
      // For now, using mock data
      setAuditLogs([
        {
          id: '1',
          action: 'login_success',
          details: { ip_address: '192.168.1.1' },
          created_at: new Date().toISOString(),
          success: true
        },
        {
          id: '2',
          action: 'profile_updated',
          details: { updated_fields: ['first_name', 'phone'] },
          created_at: new Date(Date.now() - 86400000).toISOString(),
          success: true
        }
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load security data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const result = await AuthService.revokeSession(sessionId);
      if (result.success) {
        toast({
          title: "Session Revoked",
          description: "Session revoked successfully"
        });
        loadSecurityData();
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to revoke session',
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive"
      });
    }
  };

  const getDeviceIcon = (deviceInfo: any) => {
    const userAgent = deviceInfo?.userAgent?.toLowerCase() || '';
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login_success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'login_failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'profile_updated':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Security Dashboard</h1>
                <p className="text-muted-foreground">Monitor your account security and activity</p>
              </div>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${user?.emailVerified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <CheckCircle className={`h-6 w-6 ${user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <Badge variant={user?.emailVerified ? 'default' : 'secondary'}>
                        {user?.emailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${user?.phoneVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Smartphone className={`h-6 w-6 ${user?.phoneVerified ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">Phone Verification</p>
                      <Badge variant={user?.phoneVerified ? 'default' : 'outline'}>
                        {user?.phoneVerified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-2xl font-bold">{sessions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="sessions" className="space-y-6">
              <TabsList>
                <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                <TabsTrigger value="activity">Security Activity</TabsTrigger>
                <TabsTrigger value="settings">Security Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading sessions...</p>
                      </div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No active sessions found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div key={session.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                {getDeviceIcon(session.device_info)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">
                                      {session.device_info?.platform || 'Unknown Device'}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      Current
                                    </Badge>
                                  </div>
                                  <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3" />
                                      <span>{session.ip_address || 'Unknown IP'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>Last activity: {new Date(session.last_activity).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Activity className="h-3 w-3" />
                                      <span>Expires: {new Date(session.expires_at).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Security Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          {getActionIcon(log.action)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">
                                {log.action.replace('_', ' ')}
                              </span>
                              <Badge variant={log.success ? 'default' : 'destructive'}>
                                {log.success ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                            {log.details && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(log.details)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Secure your account with email-based verification
                          </p>
                        </div>
                        <Badge variant={user?.emailVerified ? 'default' : 'secondary'}>
                          {user?.emailVerified ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">End-to-End Encryption</p>
                            <p className="text-sm text-muted-foreground">Your data is encrypted</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Activity Monitoring</p>
                            <p className="text-sm text-muted-foreground">Track account activity</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityDashboard;