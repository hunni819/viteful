import { useNavigate } from 'react-router-dom';
import useChangeSeoHead from '../hooks/useChangeSeoHead';
import { FC, PropsWithChildren } from 'react';

interface LayoutRouteProps extends PropsWithChildren {}

const Layout: FC<LayoutRouteProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();

  //* CSR에서 navigate로 이동 시, 기존 SEO Tag들 교체.
  useChangeSeoHead();

  return (
    <>
      <nav>
        <button onClick={() => navigate('/')}>home</button>
        <button onClick={() => navigate('/profile')}>profile</button>
      </nav>
      {children}
    </>
  );
};
export default Layout;
