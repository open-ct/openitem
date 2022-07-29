import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd';
import BannerImage from './BannerImage';

class Banner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }
  static defaultProps = {
    className: 'home-banner',
  }
  render() {
    const { className } = this.props;
    return (
      <div className={`home-layout-wrapper ${className}`}>
        <div className="home-layout">
          <QueueAnim className={`${className}-content-wrapper`} delay={300} ease="easeOutQuart">
            <h1 key="h2">
              极简流程，一键呈现
            </h1>
            <p key="p" style={{fontWeight:700}}>命题与题库系统旨在创新考试命审题与题库建设模式，为命审题及题库建设工作提供全周期的信息化生产及管理工具。 覆盖征题、审题、组卷、审卷和题库管理及命审题专家管理等环节。</p>
            <span key="button">
              <Button
                type="primary"
                onClick={() => {
                window.location.href = '/signin';
              }}
              >
                开始使用
              </Button>
            </span>
          </QueueAnim>
          <div className={`${className}-image-wrapper`}>
            <BannerImage />
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
