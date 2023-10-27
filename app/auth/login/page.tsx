import { Session, getServerSession } from 'next-auth';
import LoginComponent from './loginComponent';
import { redirect } from 'next/navigation';

const Login = async () => {
  const session: any = await getServerSession();
  if (session) redirect('/');
  return <LoginComponent />;
};

export default Login;
