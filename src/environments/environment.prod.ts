export const environment = {
  production: false,
  default_language: 'fr',
  url_base_api: 'https://api.thesez-vous.org',
  environment_paysafe: 'LIVE',
  // tslint:disable-next-line:max-line-length
  token_paysafe: 'U1VULTIwNzI3MjpCLXAxLTAtNWI5Mjg5OTItMC0zMDJjMDIxNDczNDgwYjc5NjM5OTRiZDRjMDFlYTQxODhlMzMxZmEwYWRlNjU3NDIwMjE0NjMzMGQ5OGQ0YjFiYTA3YjNjNmVmYjMxNTJlMWQyMTljNTI0MjI1ZA==',
  paths_api: {
    activation: '/users/activate',
    authentication: '/authentication',
    users: '/users',
    organizations: '/organizations',
    domains: '/domains',
    academic_fields: '/academic_fields',
    academic_levels: '/academic_levels',
    reset_password: '/reset_password',
    change_password: '/change_password',
    activate_user: '/users/activate',
    workplaces: '/workplaces',
    profile: '/profile',
    time_slots: '/time_slots',
    periods: '/periods',
    memberships: '/memberships',
    reservationPackages: '/packages',
    pictures: '/pictures',
    cards: '/payment_profiles',
    orders: '/orders',
  }
};
