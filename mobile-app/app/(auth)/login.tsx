import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();

  const mockLogin = (role: 'worker' | 'manager' | 'owner') => {
    login({
      id: 1,
      role,
      token: 'demo-token',
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
      <Text>Login (Part 1)</Text>
      <Button title="Login as Worker" onPress={() => mockLogin('worker')} />
      <Button title="Login as Manager" onPress={() => mockLogin('manager')} />
      <Button title="Login as Owner" onPress={() => mockLogin('owner')} />
    </View>
  );
}
