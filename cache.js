import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

const keyvRedis = new KeyvRedis('redis://127.0.0.1:6379');
console.log(keyvRedis);

const cache = new Keyv({ store: keyvRedis, namespace: 'cache' });
console.log(cache);

const users = new Keyv(new KeyvRedis('redis://localhost:6379'), { namespace: 'users' });
console.log(users);

await users.set("foo", "bar");
console.log(await users.get('foo'));

await cache.set('testing', false);
await cache.set('foo', 'foobar');
await cache.set('bar', 'barfoo');
console.log(await cache.get('testing'));
console.log(await cache.get('foo'));
console.log(await cache.get('bar'));
await cache.clear();
