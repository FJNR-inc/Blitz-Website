export const environment = {
  production: false,
  default_language: 'fr',
  url_base_api: 'https://api-dev.thesez-vous.org',
  environment_paysafe: 'TEST',
  // tslint:disable-next-line:max-line-length
  token_paysafe: 'T1QtMjMxODcwOkItcWEyLTAtNWI4NmUxMDktMC0zMDJjMDIxNDJiMWI4YjNjZmMyNmM0YTc3ZTUzNTI0YjYzNzEwMzU3YWE1NmYzNWMwMjE0NjM5N2ZhZTJiMDZjNjFiYmFhNGQ1NGZjNDE2MjlhOGIxNzVmOTRhNw==',
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
