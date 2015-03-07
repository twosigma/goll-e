var CreditsPanel = require('./panels/credits.jsx');
var GCLPanel = require('./panels/gcl.jsx');

/*
object keyed by unique panel name. 
properties:
  icon: url to icon image
  title: title text
  panelContent: panel react class
  props: any props to pass to panel when constructed
 */
module.exports = {
  gcl: {
    icon: '/images/icons/gcl.svg',
    title: 'Content Code Editor',
    panelContent: GCLPanel
  },
  
  credits: {
    icon: '/images/icons/about.svg',
    title: 'Credits',
    panelContent: CreditsPanel
  }
};