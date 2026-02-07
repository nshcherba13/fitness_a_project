const ReactRouterDOM = jest.requireActual('react-router-dom');

module.exports = {
  ...ReactRouterDOM,
  useNavigate: jest.fn(() => jest.fn()), 
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn(() => ({ pathname: '/' })), 
  BrowserRouter: ({ children }) => <div>{children}</div>, 
  Link: ({ to, children }) => <a href={to}>{children}</a>, 
  NavLink: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ), 
};
