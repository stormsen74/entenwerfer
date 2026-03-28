import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to the Entenwerfer',
        headline: '– Ultimate Frisbee in Hamburg-Rothenburgsort –',
        paragraph1:
          'Every monday at 18:30 p.m we meet at Elbpark Entenwerder to throw frisbees and to play some ultimate. In autumn and winter, we train from 7 p.m. in the sports hall of the Campus HafenCity school (Am Hannoverschen Bahnhof 21).',
        paragraph2:
          'Two people will do to pass the disc and improve technical skills. As soon as we get six players to the pitch we form teams and compete for points and kicks.',
        paragraph3:
          'The Entenwerfer are an open fun-level team within FTSV Lorbeer e.V. Everybody with a passion for frisbees and an interest in teamsports is invited. A little willingness to run and basic skills with the disc will do fine for the start. The game is easily learned and a lot of fun. Rules are simple, a brief overview can be found',
        linkToRules: 'here:',
        paragraph4: '... just show up and join us in the game ... and pass the word.',
      },
    },
    de: {
      translation: {
        welcome: 'Willkommen bei den Entenwerfern',
        headline: '– Ultimate Frisbee in Hamburg-Rothenburgsort –',
        paragraph1:
          'Immer montags um 18:30 Uhr treffen wir uns im Elbpark Entenwerder zum Frisbee-Werfen und auf ein paar heiße Partien Ultimate.<br/>Im Herbst und Winter trainieren wir ab 19:00 Uhr in der Sporthalle der Schule Campus HafenCity (Am Hannoverschen Bahnhof 21).',
        paragraph2:
          'Zwei reichen, um die Scheibe hin und her zu werfen und Technik zu üben. Sobald sechs Leute zusammen sind, bilden wir Teams und spielen um Punkte und Kicks.',
        paragraph3:
          'Die Entenwerfer sind ein offenes Freizeitteam mit Vereins&shy;zugehörigkeit bei FTSV Lorbeer. Eingeladen sind alle, die Freude an Frisbees und Lust auf Teamsport haben. Ein bisschen Laufbereitschaft und Grundkenntnisse an der Scheibe reichen für den Einstieg völlig aus. Das Spiel ist schnell gelernt und macht viel Spaß. Die Regeln sind einfach, eine kurze Übersicht gibt es',
        linkToRules: 'hier:',
        paragraph4: '... einfach vorbeikommen und mitmachen ... und gerne auch weitersagen.',
      },
    },
  },
  lng: 'de',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
