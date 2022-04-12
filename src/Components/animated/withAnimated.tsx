import React, { ComponentType } from "react"
import { Animated } from "react-native"

export function withAnimated(
    WrappedComponent: React.ComponentType<any>,
  ): ComponentType {
    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
    class WithAnimated extends React.Component {
      static displayName = `WithAnimated(${displayName})`;
  
      render(): React.ReactNode {
        return <WrappedComponent {...this.props} />;
      }
    }
  
    return Animated.createAnimatedComponent(WithAnimated);
  }