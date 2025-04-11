//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const getUserData = require('./utils/get-user-data');
const selectedUser = 'barbara';

const userData = getUserData(selectedUser);

const entitledSupport = userData.entitledSupport || [];
const relatedNavigation = userData.relatedNavigation || [];
const upcomingActions = userData.upcomingActions || [];
const supportApplications = userData.supportApplications || [];
const pastEvents = userData.pastEvents || [];

// --------------------------------------------------------
// GENERAL
// --------------------------------------------------------

router.use('/', function(req, res, next) {
  res.locals.currentPath = req.path;
  res.locals.name = 'Barbara';
  res.locals.headerType = 'signedin';
  next();
});

router.use('/browse', (req, res, next) => {
  res.locals.headerType = 'signedin';
  next();
});

router.use('/browse/application-complete', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.use('/browse/page-not-found', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.use('/browse/create-your-govuk-one-login-or-sign-in', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.use('/browse/start-now', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});


// --------------------------------------------------------
// SUPPORT IF YOU HAVE A LONG TERM HEALTH CONDITION
// --------------------------------------------------------

router.use('/support', (req, res, next) => {
  res.locals.headerType = 'signedout';
  res.locals.browse = true;
  next();
});

router.get('/support', (req, res) => {
  res.render('support/index', {
    breadcrumbs: [
      { text: 'Home', href: '/' }
    ]
  });
});

router.get('/support/in-work', (req, res) => {
  res.render('support/in-work/index', {
    breadcrumbs: [
      { text: 'Home', href: '/' },
      { text: 'Support', href: '/support' }
    ]
  });
});

router.get('/support/not-in-work', (req, res) => {
  res.render('support/not-in-work/index', {
    breadcrumbs: [
      { text: 'Home', href: '/' },
      { text: 'Support', href: '/support' }
    ]
  });
});


// --------------------------------------------------------
// STRETCH
// --------------------------------------------------------

router.use('/stretch', (req, res, next) => {
  res.locals.headerType = 'signedin';
  res.locals.serviceNav = true;
  next();
});

router.get('/stretch/consent', (req, res) => {
  res.locals.serviceNav = false;
  res.render('stretch/consent/index');
});

router.get('/stretch/consent/v1', (req, res) => {
  res.locals.serviceNav = false;
  res.render('stretch/consent/v1/index');
});

router.get('/stretch/consent/v2', (req, res) => {
  res.locals.serviceNav = false;
  res.render('stretch/consent/v2/index');
});

router.post('/stretch/consent',(req, res) => {

  var hasConsented = req.session.data['consent'];
  res.locals.serviceNav = false;

  // Initialize an array for error messages
  let errors = [];

  // Check if consent is selected
  if (!hasConsented) {
    errors.push({
      text: 'Select if you give consent',
      href: '#consent'
    });
  }

  // If there are errors, re-render the page with errors
  if (errors.length > 0) {
    return res.render('stretch/consent/index', {
      errorSummary: {
        titleText: 'There is a problem',
        errorList: errors
      },
      consentError: errors.find(e => e.href === '#consent') || null
    });
  }

  if (hasConsented == 'yes') {
    res.redirect('/stretch/');
  }

});

router.get('/stretch', (req, res) => {

  var hasConsented = req.session.data['consent'];

  if (hasConsented == 'yes') {

    res.render('stretch/index', {
      entitledSupport: entitledSupport,
      relatedNavigation: relatedNavigation
    });

  } else {
    res.redirect('/stretch/consent');
  }

});

router.get('/stretch/your-applications', (req, res) => {

  var hasConsented = req.session.data['consent'];

  if (hasConsented == 'yes') {

    res.locals.currentPage = 'your-applications';
    res.render('stretch/your-applications/index', {
      supportApplications: supportApplications
    });

  } else {
    res.redirect('/stretch/consent');
  }

});

router.get('/stretch/your-timeline', (req, res) => {

  var hasConsented = req.session.data['consent'];

  if (hasConsented == 'yes') {

  res.locals.currentPage = 'your-timeline';
  res.render('stretch/your-timeline/index', {
    upcomingActions: upcomingActions,
    pastEvents: pastEvents
  });

  } else {
    res.redirect('/stretch/consent');
  }

});

router.get('/stretch/your-applications/:id', (req, res) => {

  var hasConsented = req.session.data['consent'];

  if (hasConsented == 'yes') {

    const applicationId = req.params.id;
    const application = userData.supportApplications.find(app => app.id === applicationId);

    res.render('stretch/your-applications/details', {
      application: application
    });

  } else {
    res.redirect('/stretch/consent');
  }

});


// STRETCH V2

function getNavigation(currentPath) {
  return [
    { text: 'Applications in progress', href: '/stretch/v2/applications/' },
    { text: 'Actions you need to take', href: '/stretch/v2/applications/actions-you-need-to-take/' },
    { text: 'Your activity log', href: '/stretch/v2/applications/your-activity-log/' },
    { text: 'Previous applications', href: '/stretch/v2/applications/previous-applications/' }
  ].map(item => ({
    ...item,
    active: item.href === currentPath
  }));
}

router.use('/stretch/v2', (req, res, next) => {
  res.locals.headerType = 'signedin';
  res.locals.serviceNav = true;
  res.locals.stretchVersion = '2';
  next();
});

router.get('/stretch/v2', (req, res) => {
  res.locals.currentPage = 'home'
  res.render('stretch/v2/index');
});

router.get('/stretch/v2/currently-getting', (req, res) => {
  res.locals.currentPage = 'currently-getting'
  res.render('stretch/v2/currently-getting/index');
});

router.get('/stretch/v2/entitled-to', (req, res) => {
  res.locals.currentPage = 'entitled-to'
  res.render('stretch/v2/entitled-to/index');
});

router.get('/stretch/v2/applications', (req, res) => {
  res.locals.currentPage = 'applications'
  res.render('stretch/v2/applications/index', {
    navigation: getNavigation(req.path)
  });
});

router.get('/stretch/v2/applications/actions-you-need-to-take/', (req, res) => {
  res.locals.currentPage = 'applications'
  res.render('stretch/v2/applications/actions-you-need-to-take/index', {
    navigation: getNavigation(req.path)
  });
});

router.get('/stretch/v2/applications/your-activity-log/', (req, res) => {
  res.locals.currentPage = 'applications'
  res.render('stretch/v2/applications/your-activity-log/index', {
    navigation: getNavigation(req.path)
  });
});

router.get('/stretch/v2/applications/previous-applications/', (req, res) => {
  res.locals.currentPage = 'applications'
  res.render('stretch/v2/applications/previous-applications/index', {
    navigation: getNavigation(req.path)
  });
});



// --------------------------------------------------------
// FIT NOTE
// --------------------------------------------------------

router.use('/fit-note', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.get('/fit-note', (req, res) => {
  res.locals.browse = true;
  res.render('fit-note/index');
});

router.get('/fit-note/v2', (req, res) => {
  res.render('fit-note/v2/index');
});

router.get('/fit-note/v3', (req, res) => {
  res.render('fit-note/v3/index');
});

router.get('/fit-note/v4', (req, res) => {
  res.render('fit-note/v4/index');
});

// Mainstream guide version

router.use('/fit-note/mainstream-guide/', (req, res, next) => {
  res.locals.breadcrumbs = [
    { text: 'Home', href: '#0' },
    { text: 'Benefits', href: '#0' }
  ];
  next();
});



// --------------------------------------------------------
// ACCESS TO WORK
// --------------------------------------------------------

router.use('/access-to-work', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.get('/access-to-work', (req, res) => {
  res.locals.headerType = 'simple';
  res.locals.serviceName = 'Access to Work';
  res.locals.serviceUrl = '#0';
  res.render('access-to-work/index');
});

router.get('/access-to-work/support', (req, res) => {
  res.render('access-to-work/support');
});

// Mainstream guide version

router.use('/access-to-work/mainstream-guide/', (req, res, next) => {
  res.locals.breadcrumbs = [
    { text: 'Home', href: '#0' },
    { text: 'Benefits', href: '#0' }
  ];
  next();
});


// --------------------------------------------------------
// UNIVERSAL CREDIT
// --------------------------------------------------------

router.use('/universal-credit', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});

router.get('/universal-credit', (req, res) => {
  res.locals.headerType = 'simple';
  res.locals.serviceName = 'Universal Credit';
  res.locals.serviceUrl = '#0';
  res.render('universal-credit/index');
});

router.get('/universal-credit/support', (req, res) => {
  res.render('universal-credit/support');
});

// Mainstream guide version

router.use('/universal-credit/mainstream-guide/', (req, res, next) => {
  res.locals.breadcrumbs = [
    { text: 'Home', href: '#0' },
    { text: 'Benefits', href: '#0' }
  ];
  next();
});


// --------------------------------------------------------
// PERSONAL INDEPENDENCE PAYMENT
// --------------------------------------------------------

router.use('/personal-independence-payment', (req, res, next) => {
  res.locals.headerType = 'signedout';
  next();
});


// Mainstream guide version

router.use('/personal-independence-payment/mainstream-guide/', (req, res, next) => {
  res.locals.breadcrumbs = [
    { text: 'Home', href: '#0' },
    { text: 'Benefits', href: '#0' }
  ];
  next();
});
