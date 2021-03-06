import React from 'react';
import { Link } from 'react-router-dom';

import { Page } from '../components/Page/Page';
import { Header } from '../components/Header/Header';
import { Content } from '../components/Content/Content';
import { Footer } from '../components/Footer/Footer';
import { Button } from '../components/Button/Button';
import { TextWithIcon } from '../components/TextWithIcon/TextWithIcon';
import { ConfigInfo } from '../components/ConfigInfo/ConfigInfo';
import { Title } from '../components/Title/Title';

type StartPageProps = {
  isMobile: boolean
}

export const StartPage: React.FC<StartPageProps> = ({ isMobile }) => {
  return (
    <Page id="startPage">
      <Header isMobile={isMobile}>
        <Link to="/">
          <Title isMobile={isMobile}>School CI server</Title>
        </Link>
        <Link to="/settings">
          <Button size='s' id='toSettings2'>
            <TextWithIcon
              img="images/settings_icon.svg"
              text="Settings"
              isMobile={isMobile}
            />
          </Button>
        </Link>
      </Header>
      <Content centeredV centeredH>
        <ConfigInfo />
      </Content>
      <Footer isMobile={isMobile} />
    </Page>
  );
};
