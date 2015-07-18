---
question: Is there any completion?
answer: Yes. Run `ignition completion install` to do the setup, then open a new shell and enjoy.
---
Yes. But you will also need to enable the completion first (only once).

**Install completion**

```
ignition completion install
```

**Use completion**

```
ignition an<tab>
ignition angular2:route
```

Why doesn't it propose me just `ignition angular2`? That's because you cannot run a subgenerator directly, they will be executed by the main command `ignition` depending on your answer. You can only run code snippet (like creating an Angular 2 route).
