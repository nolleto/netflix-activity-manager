const addActivityButton = () => {
  const h1 = document.querySelector('h1')
  const button = document.createElement('button')
  const addCss = addCssAdder(button)

  addCss('float', 'right')
  addCss('fontSize', '16px')
  addCss('margin', '5px 10px 0 0')
  addCss('borderRadius', '5px')

  button.textContent = 'Manage activities'
  button.addEventListener('click', () => {
    const loadMore = prompt('Do you want to load more of your activity?\nIf so, how many times do you want we press to "Show More" bottom button?\n(Cancel or leace blank to open the modal withouts load more activity)')
    const number = getNumber(loadMore)

    loadAndOpenModals(number)
  })

  h1.append(button)
}

const getNumber = (number) => {
  const value = Number(number)

  return Number.isNaN(value) ? 0 : value
}

const clickShowMore = () => {
  const button = getShowMoreButton()

  button && button.click()
}

const showMore = (times = 10, callback) => {
  const counter = times
  const loaderModal = createModal()
  const updateLoaderModal = updateModalText(loaderModal)
  const update = () => {
    const finished = times <= 0

    if (finished || noMoreActivitiesToLoad()) {
      loaderModal.remove()
      callback && callback()
    } else {
      if (isNotLoading()) {
        clickShowMore()
        times--
        updateLoaderModal(`Loading more activities: ${counter - times}/${counter}`)
      }
      setTimeout(update, 50)
    }
  }

  update()
}

const updateModalText = (modal) => (text) => {
  const modalContent = modal.querySelector('[data-content]')

  modalContent.textContent = text
}

const createModalToRemoveHistory = (showSession = true) => {
  const modal = createModal()
  const modalContent = modal.querySelector('[data-content]')
  const createTableWithData = tableCreator(modalContent)

  addFilters(modalContent, createTableWithData)

  createTableWithData(getTitlesData(showSession))
}

const tableCreator = (modalContent) => (data) => {
  const table = createTable(data)
  const currentTable = modalContent.querySelector('table')

  currentTable && currentTable.remove()
  modalContent.append(table)
}

const addFilters = (modalContent, createTableWithData) => {
  const input = createSearchInput()
  const checkbox = createCheckboxSession()
  const updateTable = tableUpdater(createTableWithData)

  input.addEventListener('input', ({ target }) => {
    updateTable({ searchText: target.value.trim() })
  })

  checkbox.addEventListener('change', ({ target }) => {
    updateTable({ groupBySession: target.checked })
  })

  modalContent.append(input)
  modalContent.append(checkbox)
}

const tableUpdater = (createTableWithData) => {
  let lastOpts = { groupBySession: true }

  return (opts) => {
    lastOpts = { ...lastOpts, ...opts }

    executeOnBackground(() => createTableWithData(createFilteredData(lastOpts)))
  }
}

const createFilteredData = (opts) => {
  const { searchText, groupBySession } = opts
  const data = getTitlesData(groupBySession)

  if (searchText) {
    const rgx = new RegExp(`(${searchText})`, 'i')

    return Object.keys(data)
      .filter(str => rgx.test(str))
      .reduce((acc, value) => {
        acc[addBoldTagInText(value, rgx)] = data[value]
        return acc
      }, {})
  }

  return data
}

const createSearchInput = () => {
  const input = document.createElement('input')
  const addCss = addCssAdder(input)

  addCss('width', '500px')
  input.placeholder = 'Search for serie, shows or movies...'

  return input
}

const createCheckboxSession = () => {
  const label = document.createElement('label')
  const checkbox = document.createElement('input')
  const addCss = addCssAdder(label)
  const addCssCheckbox = addCssAdder(checkbox)

  addCss('cursor', 'pointer')
  addCss('display', 'block')
  addCss('margin', '5px 0')

  addCssCheckbox('marginRight', '5px')
  addCssCheckbox('height', '15px')

  checkbox.type = 'checkbox'
  checkbox.checked = true
  label.textContent = 'Group shows and series by session'
  label.prepend(checkbox)

  return label
}

const getTitlesData = (showSession) =>
  getLis().reduce((acc, li) => addLiReference(acc, getTitleFromLi(li, showSession), li), {})

const addLiReference = (obj, title, li) => {
  if (obj[title]) {
    obj[title].push(li)
  } else {
    obj[title] = [li]
  }

  return obj
}

const getUl = () => document.querySelector('.structural.retable.stdHeight')
const getLis = () => [...getUl().querySelectorAll('.retableRow:not(.retableRemoved)')]
const getTitleFromLi = (li, showSession) => getMainName(li.querySelector('a').textContent, showSession)
const sortByStrings = (a, b) => a.localeCompare(b)
const isNotLoading = () => getUl().nextElementSibling.childElementCount === 0
const isEscapeKey = ({ key }) => key === 'Escape'
const clickRemoveButton = (li) => li.querySelector('.deleteBtn').click()
const getLiLink = (li) => li.querySelector('.title > a').href
const getShowMoreButton = () => document.querySelector('.btn.btn-blue.btn-small')
const noMoreActivitiesToLoad = () => getShowMoreButton().disabled === true
const executeOnBackground = (fn) => setTimeout(fn, 0)
const addBoldTagInText = (str, rgx) => str.replace(rgx, '<b>$1</b>')
const loadAndOpenModals = (times) => showMore(times, createModalToRemoveHistory)

const getMainName = (str, showSession) => {
  const [title, session] = str.split(':')

  return showSession && session ? [title, session].join(':') : title
}

const createModal = () => {
  const modal = insertModal()

  setupModalLayout(modal)
  setupModalBind(modal)

  return modal
}

const insertModal = () => {
  const body = document.querySelector('body')

  body.insertAdjacentHTML('beforeend', modalHTML())
  return document.querySelector('#superModal')
}

const setupModalLayout = (modal) => {
  const addCss = addCssAdder(modal)
  const addCssContent = addCssAdder(modal.querySelector('.modal-content'))
  const addCssClose = addCssAdder(modal.querySelector('.close'))

  addCss('position', 'fixed')
  addCss('zIndex', '1')
  addCss('left', '0')
  addCss('top', '0')
  addCss('width', '100%')
  addCss('height', '100%')
  addCss('overflow', 'auto')
  addCss('backgroundColor', 'rgb(0, 0, 0)')
  addCss('backgroundColor', 'rgba(0, 0, 0, 0.4)')

  addCssContent('backgroundColor', '#fefefe')
  addCssContent('margin', '15% auto')
  addCssContent('padding', '20px')
  addCssContent('border', '1px solid #888')
  addCssContent('width', '60%')

  addCssClose('color', '#aaa')
  addCssClose('float', 'right')
  addCssClose('fontSize', '28px')
  addCssClose('fontWeight', 'bold')
  addCssClose('cursor', 'pointer')
}

const setupModalBind = (modal) => {
  const closeBtn = modal.querySelector('.close')
  const keyUpAction = (event) => isEscapeKey(event) && removeModal()
  const removeModal = () => {
    document.removeEventListener('keyup', keyUpAction)
    closeBtn.removeEventListener('click', removeModal)
    modal.remove()
  }

  closeBtn.addEventListener('click', removeModal)
  document.addEventListener('keyup', keyUpAction)
}

const addCssAdder = (el) => (prop, value) => {
  el.style[prop] = value
}

const modalHTML = () =>
  `<div id="superModal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <div data-content></div>
    </div>
  </div>`

const createTable = (data) => {
  const table = document.createElement('table')
  const titles = Object.keys(data).sort(sortByStrings)

  table.append(createTableHeader(titles))

  titles.map((title, index) => {
    const backgroundColor = index % 2 ? 'transparent' : 'lightgray'

    table.append(
      createTableTr(data, title, backgroundColor)
    )
  })

  addTableStyle(table)

  return table
}

const createTableHeader = (titles) => {
  const tr = document.createElement('tr')

  tr.append(
    addTdStyle(createElementWithHTML('th', `${titles.length} titles`))
  )
  tr.append(
    addTdStyle(createElementWithHTML('th'))
  )
  addTrStyle(tr)

  return tr
}

const createTableTr = (data, title, backgroundColor) => {
  const lis = data[title]
  const tr = document.createElement('tr')

  tr.append(
    addTdStyle(createTdTitleWithLink(title, lis))
  )
  tr.append(
    addTdStyle(createRemoveButtonTd(title, lis))
  )
  addTrStyle(tr, backgroundColor)

  return tr
}

const createTdTitleWithLink = (title, lis) => {
  const link = getLiLink(lis[0])
  const td = createElementWithHTML('td')
  const a = createElementWithHTML('a', title)

  a.href = link
  a.target = '_blank'
  td.append(a)

  return td
}

const createElementWithHTML = (tag, html) => {
  const element = document.createElement(tag)

  html && (element.innerHTML = html)
  return element
}

const createRemoveButtonTd = (title, lis) => {
  const td = document.createElement('td')
  const a = document.createElement('a')
  const addCss = addCssAdder(a)

  addCss('cursor', 'pointer')
  a.textContent = `Remove (${lis.length})`
  a.title = `Remove all activities of: ${title}`
  td.append(a)
  bindRemoveButtonTd(a, td, lis)

  return td
}

const bindRemoveButtonTd = (a, td, lis) => {
  const remover = () => {
    lis.map(clickRemoveButton)
    a.removeEventListener('click', remover)
    a.remove()
    td.textContent = `${lis.length} activities removed`
  }

  a.addEventListener('click', remover)
}

const addTableStyle = (table) => {
  const addCss = addCssAdder(table)

  addCss('width', '100%')
}

const addTrStyle = (tr, backgroundColor) => {
  const addCss = addCssAdder(tr)

  addCss('border', '1px solid black')
  backgroundColor && addCss('backgroundColor', backgroundColor)
}

const addTdStyle = (td) => {
  const addCss = addCssAdder(td)

  addCss('padding', '5px')

  return td
}

addActivityButton()
