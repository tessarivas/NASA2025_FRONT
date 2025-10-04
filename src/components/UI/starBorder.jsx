const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  backgroundColor = 'from-black to-gray-900', // Nuevo: personalizable
  height = 'py-[16px]', // Nuevo: altura personalizable
  fontSize = 'text-[16px]', // Nuevo: tamaño de texto personalizable
  borderRadius = 'rounded-[20px]', // Nuevo: border radius personalizable
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden ${borderRadius} ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style
      }}
      {...rest}>
      
      {/* Efecto de estrella inferior */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}></div>
      
      {/* Efecto de estrella superior */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}></div>
      
      {/* Contenido del botón - ahora personalizable */}
      <div
        className={`relative z-1 bg-gradient-to-br ${backgroundColor} border border-gray-800 text-white text-center ${fontSize} ${height} px-[26px] ${borderRadius} transition-all duration-300`}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
//         'star-movement-top': 'star-movement-top linear infinite alternate',
//       },
//       keyframes: {
//         'star-movement-bottom': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
//         },
//         'star-movement-top': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
//         },
//       },
//     },
//   }
// }
