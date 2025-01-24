import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

type CustomElementType = () => JSX.Element;

type CustomModule = {
  default: CustomElementType;
};

type CustomRoute = {
  path: string;
  Element: CustomElementType;
};

const pageFiles = import.meta.glob('./pages/**/*.tsx', { eager: true });
const tempRoutes: CustomRoute[] = [];

for (const filePath of Object.keys(pageFiles)) {
  try {
    const fileName = filePath.match(/\.\/pages\/(.*)\.tsx$/)?.[1] ?? '';
    // "./pages/*.tsx" -> "**"
    if (!fileName) continue;
    // "*" -> "/"
    // "./pages/blog/$id.tsx" -> "/blog/:id"
    const normalizedPathName = fileName.includes('&')
      ? fileName.replace('&', ':')
      : fileName.replace(/\/index/, '');

    tempRoutes.push({
      path:
        fileName === 'index'
          ? '/'
          : `/${normalizedPathName.toLocaleLowerCase()}`,
      Element: (pageFiles[filePath] as CustomModule).default,
    });
  } catch (err) {
    console.error(err);
    continue;
  }
}

console.log(tempRoutes);

const routes = tempRoutes.filter(
  (routes, index, arr) =>
    arr.findIndex((_route) => _route.path === routes.path) === index
);

const Router = () => {
  return (
    <Layout>
      <Routes>
        {routes.map(({ path, Element }) => (
          <Route key={`route-key-${path}`} path={path} element={<Element />} />
        ))}
      </Routes>
    </Layout>
  );
};

export default Router;
