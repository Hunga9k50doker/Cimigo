import { useState } from "react";
import useStyles from "./styles";
import clsx from "clsx";

import Container from "components/Container";
import facebookIcon from 'assets/img/fb-icon.svg';
import lnIcon from 'assets/img/ln-icon.svg';
import twitterIcon from 'assets/img/twitter-icon.svg';
import youtubeIcon from 'assets/img/youtube-icon.svg';

interface FooterProps {

}

const Footer = (props: FooterProps) => {
  const classes = useStyles();
  const [aboutWidgetMobile, setAboutWidgetMobile] = useState<boolean>(false)
  const [contactWidgetMobile, setContactWidgetMobile] = useState<boolean>(false)
  const cimigoUrl = process.env.REACT_APP_CIMIGO_URL;

  return (
    <>
    <footer className={classes.root}>
      <div className={classes.footerWidget1}>
        <Container className={classes.containerWidget1}>
          <a href={`mailto:ask@cimigo.com`} className={classes.emailContact}>
            Contact us at ask@cimigo.com
          </a>
          <div className={classes.linkSocial}>
            <div className={classes.socialContact}>
              <a href="https://www.facebook.com/CimigoVietnam" className={classes.socialContactIcon}>
                <img src={facebookIcon} alt="facebook logo" />
              </a>
              <a href="https://www.linkedin.com/company/cimigo/?originalSubdomain=vn" className={classes.socialContactIcon}>
                <img src={lnIcon} alt="linkedin logo" />
              </a>
              <a href="https://twitter.com/cimigovietnam?lang=en" className={classes.socialContactIcon}>
                <img src={twitterIcon} alt="twitter logo" />
              </a>
              <a href="https://www.youtube.com/channel/UC1lq4ngOGWl7NqGfsCOGbTA" className={classes.socialContactIcon}>
                <img src={youtubeIcon} alt="youtube logo" />
              </a>
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.footerWidget2}>
        <Container className={classes.containerWidget2}>
          <div className={classes.leftContainer}>
            <div className={classes.aboutWidget}>
              <div className={classes.header}>
                <p className={classes.textDescription}>
                  About Cimigo
                </p>
              </div>
              <div className={classes.body}>
                <a href={`${cimigoUrl}/vi/viec-lam`} className={classes.textLink}>
                  Làm việc với Cimigo
                </a>
                <a href={`${cimigoUrl}/vi/moi-nguoi`} className={classes.textLink}>
                  Mọi người
                </a>
                <a href={`${cimigoUrl}/vi/nghien-cuu-tinh-huong`} className={classes.textLink}>
                  Nghiên Cứu Tình Huống
                </a>
                <a href={`${cimigoUrl}/vi/bao-cao`} className={classes.textLink}>
                  Nghiên Cứu & Báo Cáo
                </a>
              </div>
            </div>
            <div className={classes.contactWidget}>
              <div className={classes.header}>
                <p className={classes.textDescription}>
                  Contact us
                </p>
              </div>
              <div className={classes.body}>
                <a href={`tel:+(84)2838227727`} className={classes.textLink}>
                  Phone: (84) 28 3822 7727
                </a>
                <a className={classes.textLink}>
                  Address: 217 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City, Viet Nam
                </a>
                <a href={`mailto:ask@cimigo.com`} className={classes.textLink}>
                  Email: ask@cimigo.com
                </a>
              </div>
            </div>
            <div className={classes.aboutWidgetMobile}>
              <button className={classes.headerMobile} onClick={() => setAboutWidgetMobile(!aboutWidgetMobile)}>
                <p className={classes.textDescriptionMobile}>
                  About Cimigo
                </p>
                <div className={classes.iconOpen}></div>
              </button>
              <div className={clsx(classes.bodyMobile, {
                [classes.bodyActive]: aboutWidgetMobile
              })}>
                <a href={`${cimigoUrl}/vi/viec-lam`} className={classes.textLink}>
                  Làm việc với Cimigo
                </a>
                <a href={`${cimigoUrl}/vi/moi-nguoi`} className={classes.textLink}>
                  Mọi người
                </a>
                <a href={`${cimigoUrl}/vi/nghien-cuu-tinh-huong`} className={classes.textLink}>
                  Nghiên Cứu Tình Huống
                </a>
                <a href={`${cimigoUrl}/vi/bao-cao`} className={classes.textLink}>
                  Nghiên Cứu & Báo Cáo
                </a>
              </div>
            </div>
            <div className={classes.contactWidgetMobile}>
              <button className={classes.headerMobile} onClick={() => setContactWidgetMobile(!contactWidgetMobile)}>
                <p className={classes.textDescriptionMobile}>
                  Contact us
                </p>
                <div className={classes.iconOpen}></div>
              </button>
              <div className={clsx(classes.bodyMobile, {
                [classes.bodyActive]: contactWidgetMobile
              })}>
                <a href={`tel:+(84)2838227727`} className={classes.textLink}>
                  Phone: (84) 28 3822 7727
                </a>
                <a className={classes.textLink}>
                  Address: 217 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City, Viet Nam
                </a>
                <a href={`mailto:ask@cimigo.com`} className={classes.textLink}>
                  Email: ask@cimigo.com
                </a>
              </div>
            </div>
          </div>
          <div className={classes.rightContainer}>
            <div className={classes.mapController}>
              <iframe
                className={classes.iframcustom}
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.143389361975!2d106.70470321533422!3d10.800327961704012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2ccdd7be3%3A0x2e94e0c1b1e3a835!2sCimigo%20Market%20Research!5e0!3m2!1sen!2s!4v1618030557324!5m2!1sen!2s"
                allowFullScreen loading="lazy"
                frameBorder="0"
                width="600"
                height="450"
              />
            </div>
          </div>
        </Container>
      </div>
      <div className={classes.footerWidget3}>
        <Container className={classes.containerWidget3}>
          <div className={classes.textCopyRight}>Copyright@2021.Cimigo</div>
          &nbsp; | &nbsp;
          <a className={classes.textPrivacy}>Privacy policy</a>
        </Container>
      </div>
    </footer>
  </>
  );
};

export default Footer;