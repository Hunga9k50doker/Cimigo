
import styled from 'styled-components';

const Container = styled('div')`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  @media only screen and (max-width: 1520px) {
    max-width: 1240px !important;
  }
  @media only screen and (max-width: 1024px) {
    max-width: 1024px !important;
  }
  @media only screen and (max-width: 767px) {
    max-width: 550px !important;
  }
`

export default Container