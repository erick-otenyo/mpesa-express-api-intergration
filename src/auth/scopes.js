export default {
  admin: [
    'user:create',
    'user:update',
    'user:delete',
    'user:view',
    'user:view:self',
    'user:update:self',
    'user:delete:self',
  ],
  user: ['user:view', 'user:view:self', 'user:update:self', 'user:delete:self'],
};
