
import React from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  path: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation = ({
  path,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) => {
  return (
    <div className={className}>
      <Lottie
        path={path}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
      />
    </div>
  );
};

export default LottieAnimation;
