
import Layout from '../components/MyLayout.js'
import styled from 'styled-components';
import HeadMeta from '../components/HeadMeta'
// import timg from '../statics/images/timg.png';

const Content = styled.div `
  color:red;
  font-size:20px;
`;

// const AboutImg = styled.div `
//   width: 100px;
//   height: 56px;
//   background-image: url(${timg});  
//   background-size: contain;
// `;

export default () => (
  <Layout>
    <HeadMeta></HeadMeta>
    <h1>about</h1>
    <Content>
      this is content about our intro.
      {/* <AboutImg></AboutImg> */}
    </Content>
  </Layout>
  )