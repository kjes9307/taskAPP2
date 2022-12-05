import React from 'react'
import { render, fireEvent,RenderResult } from '@testing-library/react'
import {IselectType,typeSelectProps,ItemSelect} from './index'
const type =[
    {
      textType: "text-dark",
      spanName : "psychology_alt",
      name: "Idle",
      index: 0
    },
    {
        textType: "text-danger",
        spanName : "bug_report",
        name: "Bug",
        index: 1
    },
    {
        textType: "text-info",
        spanName : "task",
        name: "Task",
        index: 2
    },
    {
        textType: "text-success",
        spanName : "lightbulb",
        name: "Idea",
        index: 3
    },
    {
        textType: "text-warning",
        spanName : "description",
        name: "Note",
        index: 4
    }
    ,
    {
        textType: "text-sp",
        spanName : "turn_sharp_right",
        name: "Improvement",
        index: 5
    }
  ]
const testProps : typeSelectProps<ItemSelect> ={
    defaultIndex : 0,
    type,
    onSelect: jest.fn(),
    className: "me-3"
}
let wrapper: RenderResult , selectElement: HTMLElement, testClickElement: HTMLElement, openOption: HTMLElement , defaultOption: HTMLElement, dropdown: Element
describe('test Select component',()=>{
    beforeEach(()=>{
        wrapper = render(<IselectType {...testProps} />)
        selectElement = wrapper.getByTestId('test-select')
        // 下拉區
        dropdown = selectElement.getElementsByClassName('d-none')[0]
        openOption = dropdown.getElementsByTagName('div')[0]
        // 預設區
        testClickElement = selectElement.getElementsByTagName('div')[0]
        defaultOption = wrapper.getAllByText("psychology_alt")[0]
    })
    it("should render the correct property",()=>{
        expect(selectElement).toBeInTheDocument()
        expect(selectElement).toHaveClass('position-relative z-10 d-inline-block typeselect me-3')
        // 檢查底下元素
        expect(testClickElement.getElementsByTagName('span').length).toEqual(1)
        expect(defaultOption).toHaveClass('material-symbols-outlined text-dark')
    })
    it("clickItems should show dropdown & click child item should close",()=>{
        fireEvent.click(testClickElement)
        expect(dropdown).not.toHaveClass("d-none")
        expect(dropdown).toHaveClass('d-block typedown-menu')
        expect(openOption).toHaveClass('type-option d-flex align-items-center active')

        const testClickItem =  dropdown.getElementsByTagName('div')[2]
        fireEvent.click(testClickItem)
        expect(dropdown).not.toHaveClass("d-block typedown-menu")
        expect(dropdown).toHaveClass('d-none')
        expect(testProps.onSelect).toHaveBeenCalledWith(2)
    })
})