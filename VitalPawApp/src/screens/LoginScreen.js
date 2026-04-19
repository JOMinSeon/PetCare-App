import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../utils/constants';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🐾</Text>
        <Text style={styles.title}>VitalPaw</Text>
        <Text style={styles.subtitle}>반려동물 건강 모니터링</Text>

        <View style={styles.form}>
          <Input label="이메일" value={email} onChangeText={setEmail} placeholder="email@example.com" />
          <Input label="비밀번호" value={password} onChangeText={setPassword} placeholder="••••••••" />
          <Button title="로그인" onPress={handleLogin} style={styles.loginBtn} />
          <Button title="회원가입" variant="secondary" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 40 },
  form: { gap: 12 },
  loginBtn: { marginTop: 12 },
});
