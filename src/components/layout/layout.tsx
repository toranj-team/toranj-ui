interface propsType {
    children: any;
}

export const Layout = (props: propsType) => {
    return (
        <div>
            {props.children}
        </div>
    )
}