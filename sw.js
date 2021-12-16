const CACHE_STATIC_NAME  = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';
//limite de cache 
const CACHE_DYNAMIC_LIMIT = 50;


function limpiarCache( cacheName, numeroItems ) {


    caches.open( cacheName )
        .then( cache => {

            return cache.keys()
                .then( keys => {
                    
                    if ( keys.length > numeroItems ) {
                        cache.delete( keys[0] )
                            .then( limpiarCache(cacheName, numeroItems) );
                    }
                });

            
        });
}




self.addEventListener('install', e => {


    const cacheProm = caches.open( CACHE_STATIC_NAME )
        .then( cache => {

            return cache.addAll([
                 // archivos cargados al cache,
                  'index.html',
                  'estilo.css',
                  'estilo2.css',
                  'img/caminadoras.jpg',
                  'img/header.jpg',
                  'img/planes_actividades.jpg',
                  'js/app.js',
                  'pages/offline.html'
            
            ]);

        
        });

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
            .then( cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));


    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );

});
                              //CACHE WITH NETWORK FALLBACK THEN CACHE
self.addEventListener('fetch', e =>{

      const respuesta = caches.match( e.request )
        .then( res => {

            if ( res ) return res;



           return fetch( e.request ).then( newResp => {

               caches.open( CACHE_DYNAMIC_NAME )
                   .then( cache => {
                      cache.put( e.request, newResp );
                      limpiarCache( CACHE_DYNAMIC_NAME, 50 );
                    });

                 return newResp.clone();
             })
                       // DEFINIMOS LA PAGINA OFFLINE PARA CARGARLA 
             .catch( errr => {
                     if(e.request.headers.get('accept').includes('text/html') ){
                           return caches.match('pages/offline.html');
                     }

             })


         });




     e.respondWith( respuesta );

})