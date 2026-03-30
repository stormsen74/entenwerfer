import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/entenwerfer_logo.svg'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Content,
  Footer,
  FooterLeft,
  FooterRight,
  Header,
  Headline,
  Separator,
  StyledLink,
  SvgImage,
  Text,
  ToggleLang,
} from '../common/styles.js'

const Home = () => {
  const { t, i18n } = useTranslation()
  const [isDefaultLang, setIsDefaultLang] = useState(true)
  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }
  const toggleLang = () => {
    setIsDefaultLang(!isDefaultLang)
  }

  useEffect(() => {
    isDefaultLang ? changeLanguage('de') : changeLanguage('en')
  }, [isDefaultLang])

  return (
    <>
      <Container>
        <Link
          to='/game'
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '60px',
            height: '60px',
            opacity: 0,
            zIndex: 100,
            display: 'block',
          }}
          aria-label='Zum Spiel'
        />
        <ToggleLang onClick={toggleLang}>{isDefaultLang ? 'EN' : 'DE'}</ToggleLang>
        <Content>
          <SvgImage src={Logo} alt='My SVG Icon' />
          <Header>{t('welcome')}</Header>
          <Headline>{t('headline')}</Headline>
          <Text style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: t('paragraph1') }} />
          <Text dangerouslySetInnerHTML={{ __html: t('paragraph2') }} />
          <Text>
            <div dangerouslySetInnerHTML={{ __html: t('paragraph3') }} />
            <StyledLink
              href={'https://www.frisbeesportverband.de/home/ausbildung/10-einfache-regeln/'}
              target={'_blank'}
              rel='noreferrer'
            >
              <div dangerouslySetInnerHTML={{ __html: t('linkToRules') }} />
            </StyledLink>
          </Text>
          <Text style={{ paddingBottom: '3rem' }} dangerouslySetInnerHTML={{ __html: t('paragraph4') }} />
          <Separator />
          <Footer>
            <FooterLeft>
              <div>M. Sturm | Stresowstrasse 30b | 20539 Hamburg</div>
              <div>Telefon: 040 / 65597773 | micha[at]edit23.de</div>
              <div>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: M. Sturm</div>
            </FooterLeft>
            <FooterRight>
              <div>© 2026</div>
            </FooterRight>
          </Footer>
        </Content>
      </Container>
    </>
  )
}

export default Home
