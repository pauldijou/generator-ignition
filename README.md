# generator-ignition

Answer tons of questions, receive the bootstrap of a brand new font-end project using the technologies you want (we don't support all the universe yet) and build your next awesome product on top of it.

## Install

```
npm install -g generator-ignition
```

## Run

```
mkdir myNewProject
cd myNewProject
ignition
```

## FAQ

- Can I see it in action?
- Which languages, libs, frameworks, etc... do you support?
- Could you add support for [the last JavaScript framework released 2 hours ago]?
- Does it use Yeoman? Why not doing `yo ignition`?
- Is there any completion?
- Did you test every possible combinations?

## Answers

### Can I see it in action?

TODO: insert shell recording

### Which languages, libs, frameworks, etc... do you support?

- Tooling
 - Gulp
- Frameworks
 - Angular 2

### Could you add support for [the last JavaScript framework released 2 hours ago]?

Fill an issue.

### Does it use Yeoman? Why not doing `yo ignition`?

Actually, you can do `yo ignition` and it will works just fine and that's because the project is a valid Yeoman generator. `ignition` is just an alias to enable completion on it (see following answer).

### Is there any completion?

Yes. But since Yeoman doesn't have any for now, you will need to use another command, which is installed by default with the generator. You will also need to enable the completion first (only once).

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

### Did you test every possible combinations?

No. There are just way too many combinations (hundreds of them actually) but we do our best to test a maximum of them. If you have any trouble with a particular combination, please run `ignition issue`, this will open a new tab in your Browser and prefill a GitHub issue with your current answers to all prompts. Just add the problem and we will take care of it.
