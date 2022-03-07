# how does this work, overall?

* a jsx function is passed to the mount() function.
* within mount():
    1. function is evaluated to create a jsx object.
    2. this object is saved in the shadows
    3. this object is recursively rendered by recursiveMount()
    4. the rendered DOM element and all of its children are attached to the DOM.

# what happens/should happen for each iteration of the recursive mount? (takes in a jsx object)

!-- rucursion
!== update shadows 

1. if tag is a string:
    1. build an element.
    2. attach prop attributes to the built element.
    3. render the children.
        1. string or number, create text node.
        2. !-- function, recursive render jsx function
            * #-- this gets a new node, but not until the next iteration of this function.
        3. !-- object, recursive render dom nodes
            * #-- this gets the same node
2. if tag is a function:
    1. evaluate the function to build jsx objext.
    2. !== save the JSX object to shadows[]
        * #-- this gets a new node right now!
        * #-- also update posToKey and keyToPos
    3. !-- recursive render the built jsx object
3. return the rendered element


# updates
scopes:
* global (testCount, testKey)
    * rixt ()
        * newTag(metaKey)


