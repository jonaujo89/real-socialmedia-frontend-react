import React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Path } from 'react-native-svg'

const Apple = ({ fill = '#fff' }) => (
  <Svg height={16} width={16} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G fill={fill} stroke={fill} strokeLinecap="round" strokeWidth="0.6">
      <Path d="M21.354,16.487c-1.338-0.506-2.233-1.721-2.334-3.17c-0.099-1.412,0.593-2.666,1.851-3.355l1.046-0.573 l-0.747-0.93c-1.255-1.563-3.051-2.497-4.804-2.497c-1.215,0-2.058,0.318-2.735,0.574c-0.478,0.181-0.855,0.323-1.269,0.323 c-0.472,0-0.938-0.166-1.478-0.358c-0.708-0.252-1.51-0.538-2.54-0.538c-1.99,0-3.997,1.188-5.237,3.098 c-1.851,2.849-1.343,7.734,1.208,11.616C5.326,22.215,6.743,23.982,8.75,24c0.013,0,0.026,0,0.039,0 c1.643,0,2.003-0.876,3.598-0.886c1.742,0.082,1.962,0.893,3.589,0.882c1.961-0.018,3.375-1.771,4.499-3.484 c0.664-1.007,0.921-1.534,1.438-2.678l0.438-0.97L21.354,16.487z" fill={fill}/>
			<Path d="M15.1,3.45c0.65-0.834,1.143-2.011,0.964-3.214c-1.062,0.073-2.302,0.748-3.027,1.628 c-0.658,0.799-1.201,1.983-0.99,3.135C13.205,5.035,14.404,4.343,15.1,3.45L15.1,3.45z"/>
    </G>
  </Svg>
)

Apple.propTypes = {
  fill: PropTypes.string
}

export default Apple
