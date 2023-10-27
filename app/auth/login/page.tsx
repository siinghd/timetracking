import { Session, getServerSession } from 'next-auth';
import LoginComponent from './loginComponent';

const Login = async () => {
  const session: any = await getServerSession();
  console.log('Client-side session: ', session);
  return <LoginComponent />;
};

export default Login;
