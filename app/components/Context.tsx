// Context.tsx
import React, { useContext } from 'react';
import { PalContext } from './PalContext'; // 确保路径正确

const Context = () => {
    const { sharedValue, updateSharedValue } = useContext(PalContext);

    return (
        <div>
            <div className='flex flex-col'>
                <div>Context Component</div>
                <div>{sharedValue}</div>
                <button onClick={() => updateSharedValue('新的值')}>
                    更新值
                </button>
            </div>
        </div>
    );
}

export default Context;