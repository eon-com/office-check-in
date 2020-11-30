# ProcessHelper

ProcessHelper is an angular library to structure and simplify observable and promise handling. 

## *Why?*

When using many API-Calls and asynchronous methods your code gets unreadable and error-prone very fast. Consider the following e-reader example: You have one observable that returns a `book` and another one that returns the active page you left of reading that book. Your code may look like this:

    bookObservable$.pipe(takeUntil($unsubscribe)).subscribe(book => {
        getPage(book).pipe(takeUntil($unsubscribe)).subscribe(page => {
            this.book = book;
            this.page = page;
        }
    });  
    
With ProcessHelper your code may look like this:

    processHelperService.builder<{book: Book, page: number}>()
        .connect(bookObservable$, 'book')
        .connect(ctx => getPage(ctx.book), 'page')
        .do(ctx => {this.page = ctx.page; this.book = book;})
        .run('exampleProcess', steps, this.unsubscribe$, this);

## Installation (WIP)

## Usage

ProcessHelper uses the builder pattern. You can create a builder by using the *ProcessHelperService* like this:

    constructur(private processHelperService: ProcessHelperService){}
    
    foo() {
        const processBuilder = this.processHelperService.builder<{ exampleStateString: string }>();
    }

The type of the builder (`<{exampleStateString: string}`) can be defined as the context of the process. In the context you store temporary results from observables or promises.

The next step is to **define** the process, in the following example we subscribe on the observable `example$` and print its output to the console.

    const steps = processBuilder
                    .connect(example$, 'exampleStateString') // the output of example$ is written to the stateVariable with the name exampleStateString
                    .do((ctx) => console.log(ctx.exampleStateString)) // with do we can execute any function and use any state variable
                    .steps;
This code will **not** do anything unless we start the process with:

    this.processHelperService.run('exampleProcess', steps, this.unsubscribe$, this);
    
Have you noticed the `unsubscribe$`? If this observable fires, the process will automatically be stopped. So you won't need any more of `.pipe(takeUntil(this.unsubscribe$))` on every observable you subscribe to.

You may also use the `.run(…)` method on the ProcessBuilder:

     const steps = processBuilder
                        .connect(example$, 'exampleStateString')
                        .do((ctx) => console.log(ctx.exampleStateString))
                        .run('exampleProcess', steps, this.unsubscribe$, this); // will call ProcessHelperService.run
    

## Contribution

### Build

Run `ng build process-helper` to build the project. The build artifacts will be stored in the `dist/` directory.

### Tests

Run `ng test process-helper` to execute the unit tests via [Karma](https://karma-runner.github.io).
