import {useAuth} from '../context/AuthProvider';
import {useAuthFlow, VIEW} from '../hooks/useAuthFlow';

// Views
import LoginView from '@/features/auth/components/views/LoginView';
import PasswordView from '@/features/auth/components/views/PasswordView';
import ForgotPasswordView from '@/features/auth/components/views/ForgotPasswordView';
import ResetPasswordView from '@/features/auth/components/views/ResetPasswordView';
import SuccessView from '@/features/auth/components/views/SuccessView';

import ResponsiveModal from "@/components/ui/ResponsiveModal";

const ContentWrapper = ({children}) => (
  <div
    className="p-8 md:p-10 h-full flex flex-col justify-center min-h-[480px] bg-white relative overflow-hidden rounded-[16px]">
    {children}
  </div>
);

export default function AuthModal() {
  const {isOpen, closeAuth} = useAuth();

  const auth = useAuthFlow(isOpen);

  const renderContent = () => {
    switch (auth.view) {
      case VIEW.LOGIN:
        return <LoginView
          login={auth.login}
          setLogin={auth.setLogin}
          isCodeSent={auth.isCodeSent}
          onSendCode={auth.sendOtp}
          onVerify={auth.verifyOtp}
          onChangeView={auth.changeView}
          error={auth.error}
          loading={auth.loading}
        />;
      case VIEW.PASSWORD:
        return <PasswordView
          login={auth.login}
          password={auth.password}
          setPassword={auth.setPassword}
          onLogin={auth.loginWithPassword}
          onChangeView={auth.changeView}
          error={auth.error}
          loading={auth.loading}
        />;
      case VIEW.FORGOT:
        return <ForgotPasswordView
          login={auth.login}
          setLogin={auth.setLogin}
          isCodeSent={auth.isCodeSent}
          onSendResetCode={auth.sendOtp}
          onVerify={auth.verifyOtp}
          onChangeView={auth.changeView}
          error={auth.error}
          loading={auth.loading}
        />;
      case VIEW.RESET:
        return <ResetPasswordView
          code={auth.code}
          onReset={auth.submitNewPassword}
          error={auth.error}
          loading={auth.loading}
        />;
      case VIEW.SUCCESS:
        return <SuccessView redirectUrl={auth.redirectUrl}/>;
      default:
        return null;
    }
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={closeAuth} title="Вход в аккаунт">
      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
    </ResponsiveModal>
  );
}