const CACHE_NAME =
  'sman9-scanner-v3';

const APP_FILES = [
  './',
  './index.html'
];

self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          cache =>
            cache.addAll(
              APP_FILES
            )
        )
        .then(
          () =>
            self.skipWaiting()
        )

    );

  }
);


self.addEventListener(
  'activate',
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>
            Promise.all(

              keys
                .filter(
                  key =>
                    key !==
                    CACHE_NAME
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )
        )
        .then(
          () =>
            self.clients.claim()
        )

    );

  }
);


self.addEventListener(
  'fetch',
  event => {

    /*
     * Hanya cache request GET.
     */
    if(
      event.request.method !==
      'GET'
    ){

      return;

    }


    /*
     * API Apps Script jangan dicache.
     */
    if(
      event.request.url
        .includes(
          'script.google.com'
        )
    ){

      return;

    }


    event.respondWith(

      caches
        .match(
          event.request
        )
        .then(
          cached => {

            if(
              cached
            ){

              return cached;

            }


            return fetch(
              event.request
            )
            .then(
              response => {

                if(
                  response &&
                  response.status ===
                    200
                ){

                  const copy =
                    response.clone();


                  caches
                    .open(
                      CACHE_NAME
                    )
                    .then(
                      cache =>
                        cache.put(
                          event.request,
                          copy
                        )
                    );

                }


                return response;

              }
            );

          }
        )

    );

  }
);
