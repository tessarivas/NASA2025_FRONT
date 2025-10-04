import GradientText from '../components/GradientText'

export default function Welcome({ name }) {
  const greeting = name ? `Hi there, ${name}!` : 'Hi There!';
  
  return (
    <div className="flex flex-col items-center text-center justify-center w-full h-full">
      <div className="text-6xl w-full h-full mb-5" style={{fontFamily: 'Zen Dots'}}>
        <GradientText
          colors={["#E26B40", "#FF7A33", "#FF4F11", "#D63A12", "#A6210A"]}
          animationSpeed={4.5}
          showBorder={false}
          className="custom-class"
        >
          {greeting}
        </GradientText>
      </div>
      <p
        className="text-white/90 text-lg text-center max-w-lg leading-relaxed"
        style={{ fontFamily: 'Space Mono, monospace' }}
      >
        Explore more than 608 NASA publications on space bioscience using AI. Discover breakthroughs, knowledge gaps, and key connections.
      </p>
    </div >
  );
}
