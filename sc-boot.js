/* Blocking, in <head>, and deliberately tiny.
   Marks the document as "the scroll engine is live" BEFORE first paint, which
   is what licenses sc-bridge.css to hide every [data-sc-cue] at opacity 0.
   Setting this later would flash the content visible and then hide it; not
   setting it at all is the no-JS floor, where everything simply stays on.
   sc-mount.js takes the class back off if the engine turns out not to work. */
document.documentElement.classList.add('sc-on');
