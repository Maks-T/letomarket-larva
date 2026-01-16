import React, { useState } from 'react';
import AuthCard from '@/features/auth/components/ui/AuthCard';
import PasswordInput from '@/features/auth/components/ui/PasswordInput';
import AuthButton from '@/features/auth/components/ui/AuthButton';

export default function ResetPasswordView({
                                            code,       // Код приходит из родителя (сохраненный с прошлого шага)
                                            onReset,
                                            error,
                                            loading
                                          }) {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Отправляем скрытый код и новый пароль
    onReset({
      code,
      password: newPassword,
      password_confirmation: newPassword
    });
  };

  return (
    <AuthCard title="Новый пароль">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">
          Придумайте новый пароль для входа в аккаунт.
        </p>

        <PasswordInput
          label="Новый пароль"
          value={newPassword}
          onChange={setNewPassword}
          error={error}
        />

        <AuthButton
          type="submit"
          loading={loading}
          // Кнопка активна, только если есть пароль и код (код должен быть передан извне)
          disabled={!newPassword || !code}
        >
          Сохранить пароль
        </AuthButton>
      </form>
    </AuthCard>
  );
}