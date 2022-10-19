
export default class PageInfo {

    constructor(key) {
        this.page_number = 1;
        this.key_main = key;
        this.page_size = 5;
        this.total_records = 0;
        this.currentPage = 1;
    }

    totalPages() {
        const empArr = JSON.parse(localStorage.getItem(this.key_main)) ?? [];
        const pages = Math.ceil(empArr.length / this.page_size);
        return pages;
    }

    changePage(page) {
        let pages = this.totalPages();
        if (page <= 1) {
            document.getElementById('prevPage').disabled = true;
            document.getElementById('firstPage').disabled = true;
            page = 1;
        } else {
            document.getElementById('prevPage').disabled = false;
            document.getElementById('firstPage').disabled = false;
        }
        if (page >= pages) {
            page = pages;
            document.getElementById('nextPage').disabled = true;
            document.getElementById('lastPage').disabled = true;
        } else {
            document.getElementById('nextPage').disabled = false;
            document.getElementById('lastPage').disabled = false;
        }
        let i = (page - 1) * this.page_size;
        let arr = JSON.parse(localStorage.getItem(this.key_main)).slice(i, i + this.page_size);
        sessionStorage.setItem(this.key_main + 'page', page);
        return arr;
    }

    nextPage() {
        // if not on last page, goto next page
        let arr = [];
        arr = this.changePage(++this.currentPage);
        return arr;
    }

    prevPage() {
        // if not on the first page, goto previous page
        let arr = [];
        arr = this.changePage(--this.currentPage);
        return arr;
    }

    firstPage() {
        let arr = [];
        this.currentPage = 1;
        arr = this.changePage(1);
        return arr;
    }

    lastPage() {
        let arr = [];
        this.currentPage = this.totalPages();
        arr = this.changePage(this.currentPage);
        return arr;
    }
}