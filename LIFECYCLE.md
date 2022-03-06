# Component Lifecyles

# Mount

The `jsx` objects are filtered through the `rixt()` function. `null` and empty objects are removed. 

The render engine than converts the objects into a an element tree through the `recursiveMount()` function. A unique key is generated for each DOM element generated this way. `jsx` elements are saved in the `shadows` using this key so they can be reused during the update cycle. It is during this process that the components are evaluated and any additional code is run.

# Update()

The render engine rerenders starting at the element that called the update() function. all children of that element are rerendered.

The following happens:
1. all children elements are deleted from the `shadows`.
2. the element's DOM tree is rendered using the `recursiveMount()` function. the keys for each element are updated in `shadows` as well.

# shadows 

what is is right now? basically a map.
{
    position: {jsx element object}
}

# component keys

data structure is a series of linked nodes. components are linked to their parents. the keys need to be persistent across renders. also need to know if a component moves.
parent - component - children 

what is needed?
* unique key generator.
* data structure that links components to parents. 
* map that links position to keys?
    {
        position: key
    }

how would it work?

* component calls update()
* jsx is reevaluated with its props
* compare new jsx obj vs existing jsx obj.
    * if jsx children are the same, and props are the same to them, stop.
    * if jsx children are the same, but props are different, update the children recursively.
    * if jsx children are different, update recursively. mount/dismount as needed.

what does mount do?
what does node strucutre look like?
{
    elementType,
    uniqueKey,
    currentPosition,
    currentProps,
    parent,
    children: []
}