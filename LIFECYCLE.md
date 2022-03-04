# Component Lifecyles

# Mount

The `jsx` objects are filtered through the `rixt()` function. `null` and empty objects are removed. 

The render engine than converts the objects into a an element tree through the `recursiveMount()` function. A unique key is generated for each DOM element generated this way. `jsx` elements are saved in the `shadows` using this key so they can be reused during the update cycle. It is during this process that the components are evaluated and any additional code is run.

# Update()

The render engine rerenders starting at the element that called the update() function. all children of that element are rerendered.

The following happens:
1. all children elements are deleted from the `shadows`.
2. the element's DOM tree is rendered using the `recursiveMount()` function. the keys for each element are updated in `shadows` as well.

