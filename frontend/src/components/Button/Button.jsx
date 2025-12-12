import './Button.css';

/**
 * Example Button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 */
const Button = ({ variant = 'primary', children, onClick, ...props }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;

