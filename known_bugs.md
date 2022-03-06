

SOLVED BUGS:
* the root element somehow gets rendered twice before rendering the first time. This causes the initial render count to be 2, but then when its rendered again, it drops to 1. its almost like the variable scope gets reset somewhere along the way? non-root elements don't have this problem.

* props equal to 0 (number) don't render for some reason, but if they are cast to string they do.
* scoped state components don't update the last component. weird.