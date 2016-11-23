const classNameRegex = /className=\"([a-zA-Z\-\_\s]*)\"/ig;
const classNamesRegex = /classnames\(((.|\s)*?)\)/img;
const stringBetweenQuotesRegex = /(["'])(\\?.)*?\1/img;
let ignore = [];

function loader(source, inputSourceMap) {
    let prefix = getQueryParameterByName('prefix', this.query);

    if (prefix) {
        // Process classes with classnames module
        let classNamesMatches = source.match(classNamesRegex);

        if (classNamesMatches) {
            classNamesMatches.map(item => {
                item = item.replace(/\s+/g, '');

                let classNamesMatchesStrings = item.match(stringBetweenQuotesRegex);

                if (classNamesMatchesStrings) {
                    classNamesMatchesStrings.map(item => {
                        item = item.replace(/['"]/g, '');

                        source = source.replace(new RegExp(item, 'g'), text => {
                            const replaceResult = prefix + '-' + text;
                            ignore.push(replaceResult);
                            return replaceResult;
                        });
                    });
                }
            });
        }

        source = source.replace(classNameRegex, (text, classNames) => {
            let attr = text.match(/classname/ig);
            if (attr && attr[0]) {
                attr = attr[0];
            } else {
                attr = 'className';
            }

            let prefixedClassNames = classNames
            .split(' ')
            .map((className) => {
                if (ignoreClassName(className)) {
                    return className;
                }

                return `${prefix}-${className}`;
            })
            .join(' ');

            return `${attr}='${prefixedClassNames}'`;
        });
    }

    this.callback(null, source, inputSourceMap);
}

function ignoreClassName(className, options = {}) {
    return classMatchesTest(className, options.ignore) ||
        className.trim().length === 0 ||
        /^[A-Z-]/.test(className) ||
        ignore.findIndex(item => className === item) >= 0;
}

function classMatchesTest(className, ignore) {
    if (!ignore) return false

    className = className.trim()

    if (ignore instanceof RegExp) return ignore.exec(className)

    if (Array.isArray(ignore)) {
        return ignore.some((test) => {
            if (test instanceof RegExp) return test.exec(className)

            return className === test
        })
    }

    return className === ignore
}

function getQueryParameterByName(name, query) {
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(query);
    if (!results) return null;
    if (!results[2]) return '';
    return results[2].replace(/\+/g, " ");
}

export default loader;