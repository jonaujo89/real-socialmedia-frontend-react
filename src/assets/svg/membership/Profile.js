import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const Boost = ({ fill = '#333', style = {} }) => (
  <Svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G fill={fill} stroke={fill} strokeLinecap="round" strokeWidth="1.5">
			<Path d="M14.182,9.966S15.125,4.412,11.273,2A6.8,6.8,0,0,1,8.709,6.92C7.063,8.368,3.967,11.616,4,15.089a7.962,7.962,0,0,0,4.368,7.164,5.046,5.046,0,0,1,1.765-3.487A4.113,4.113,0,0,0,11.71,16a7.412,7.412,0,0,1,3.926,6.179V22.2a7.449,7.449,0,0,0,4.336-6.463A11.574,11.574,0,0,0,17.309,8" fill="none" stroke={fill}/>
    </G>
  </Svg>
)

export default Boost
