/*
    和dom操作相关的
*/
const rnowhite = /\S+/g;
const rclass = /[\t\r\n\f]/g;

export function ready(callback) {
    if (document && /loaded|interactive|complete/.test(document.readyState) && document.body) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            callback();
        }, false);
    }
}

export function getClass(el) {
    return el.classList ? [].slice.call(el.classList).join(' ') : (el.getAttribute && el.getAttribute('class') || '');
}

export function addClass(classstr) {
    let i = 0,
        j = 0,
        el,
        classes,
        curClass,
        cur,
        add,
        finalClass;
    if (typeof classstr === 'string' && classstr) {
        classes = classstr.match(rnowhite) || [];
        if (this[i].classList) {
            while (el = this[i++]) {
                while (add = classes[j++]) {
                    if (!el.classList.contains(curClass)) {
                        el.classList.add(curClass);
                    }
                }
            }
        } else {
            while (el = this[i++]) {
                curClass = getClass(el);
                cur = (el.nodeType === 1) && ` ${curClass} `.replace(rclass, '');
                while (add = classes[j++]) {
                    if (cur.indexOf(add) == -1) {
                        cur += add + ' ';
                    }
                    finalClass = MQ.trim(cur);
                    if (cur !== finalClass) {
                        el.className = finalClass;
                    }
                }
            }
        }
    }
}

export function removeClass(classstr) {
    let i = 0,
        j = 0,
        el,
        classes,
        curClass,
        cur,
        add,
        finalClass;
    if (!arguments.length) {
        return;
    }
    if (typeof classstr === 'string' && classstr) {
        classes = classstr.match(rnowhite) || [];
        if (this[i].classList) {
            while (el = this[i++]) {
                while (add = classes[j++]) {
                    if (el.classList.contains(curClass)) {
                        el.classList.remove(curClass);
                    }
                }
            }
        } else {
            while (el = this[i++]) {
                curClass = getClass(el);
                cur = (el.nodeType === 1) && ` ${curClass} `.replace(rclass, '');
                while (add = classes[j++]) {
                    if (cur.indexOf(add) !== -1) {
                        cur = cur.replace(add, '');
                    }
                    finalClass = MQ.trim(cur);
                    if (cur !== finalClass) {
                        el.className = finalClass;
                    }
                }
            }
        }
    }
}

export function hasClass(classstr) {
    let i = 0,
        el;
    if (this[i].classList) {
        while (el = this[i++]) {
            return el.classList.contains(classstr);
        }
    } else {
        while (el = this[i++]) {
            if (el.nodeType === 1 && `${getClass(el)}`.replace(rclass, '').indexOf(classstr) !== -1) {
                return true;
            }
        }
    }
    return false;
}

export function toggleClass(classstr) {
    let i = 0,
        el;
    if (this[i].classList) {
        while (el = this[i++]) {
            el.classList.toggle(classstr);
        }
    } else {
        while (el = this[i++]) {
            if (!el.hasClass(classstr)) {
                el.addClass(classstr);
            } else {
                el.removeClass(classstr);
            }
        }
    }
    return this;
}

export function append(domstr) {
    let doc = MQ.parseHTML(domstr),
        i = 0,
        eles = Array.prototype.slice.apply(doc),
        el;

    while (el = this[i++]) {
        eles.forEach(value => {
            el.appendChild(value);
        })
    }
    return this;
}

export function appendTo(selector) {
    let i = 0,
        parents = Array.prototype.slice.apply(MQ.find(selector)),
        son;
    while (son = this[i++]) {
        parents.forEach(el => {
            el.appendChild(son);
        })
    }
    return this;
}

MQ.fn.extend({
    ready,
    getClass,
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    append,
    appendTo
});