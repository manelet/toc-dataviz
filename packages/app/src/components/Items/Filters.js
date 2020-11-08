import React from "react";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import categoriesMap from '../../categories';

import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="left"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export default props => {
    const { price, categories, onCategoryChange, onChange } = props;
    return (
        <div className="filters">
            <div className="head">
                filtres
            </div>
            <div className="range">
                <Range 
                    max={ price.max }
                    value={ price.value }
                    onChange={onChange}
                    handle={handle}
                />
            </div>
            <div className="categories has-text-centered">
                {Object.keys(categoriesMap).map((c, i) => {
                    const isActive = categories.includes(c);
                    const status = isActive ? "disable" : "enable";
                    const className = isActive ? categoriesMap[c] : "is-light";

                    return (
                        <span
                            key={`cat-${i}`}
                            onClick={() => onCategoryChange(c, status) }
                            className={`tag is-rounded ${className}`}
                        >
                                {c}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
        