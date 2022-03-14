import { ObjectUtils, classNames } from '../utils/utils';

type CardTemplateTypes = React.ReactNode | ((props: CardProps) => React.ReactNode);

export interface CardProps {
    id?: string;
    header?: CardTemplateTypes;
    footer?: CardTemplateTypes;
    title?: CardTemplateTypes;
    subTitle?: CardTemplateTypes;
    style?: object;
    className?: string;
    children?: React.ReactNode;
}

const Card = (props: CardProps) => {

    const renderHeader = () => {
        if (props.header) {
            return <div className="p-card-header">{ObjectUtils.getJSXElement(props.header, props)}</div>;
        }

        return null;
    }

    const renderBody = () => {
        const title = props.title && <div className="p-card-title">{ObjectUtils.getJSXElement(props.title, props)}</div>
        const subTitle = props.subTitle && <div className="p-card-subtitle">{ObjectUtils.getJSXElement(props.subTitle, props)}</div>
        const children = props.children && <div className="p-card-content">{props.children}</div>
        const footer = props.footer && <div className="p-card-footer">{ObjectUtils.getJSXElement(props.footer, props)}</div>;

        return (
            <div className="p-card-body">
                {title}
                {subTitle}
                {children}
                {footer}
            </div>
        );
    }

    const header = renderHeader();
    const body = renderBody();
    let className = classNames('p-card p-component', props.className);

    return (
        <div className={className} style={props.style} id={props.id}>
            {header}
            {body}
        </div>
    );
}


Card.defaultProps = {
    id: null,
    header: null,
    footer: null,
    title: null,
    subTitle: null,
    style: null,
    className: null
};

export default Card