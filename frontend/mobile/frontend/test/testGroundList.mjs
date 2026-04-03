import { getTestSites } from '../src/api/testSite.js';

(async () => {
  try {
    console.log('Calling getTestSites...');
    const res = await getTestSites({ provingGroundId: 3, page: 0, size: 20 });
    console.log('Response:');
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error while calling getTestSites:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(2);
  }
})();
