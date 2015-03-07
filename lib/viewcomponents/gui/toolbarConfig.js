var CreditsPanel = require('./panels/credits.jsx');

/*
object keyed by unique panel name. 
properties:
  icon: url to icon image
  title: title text
  panelContent: panel react class
  props: any props to pass to panel when constructed
 */
module.exports = {
  credits: {
    icon: '/images/icons/about.svg',
    title: 'Credits',
    panelContent: CreditsPanel
  },
  credits2: {
    icon: '/images/icons/about.svg',
    title: 'Credits',
    panelContent: CreditsPanel
  },
};